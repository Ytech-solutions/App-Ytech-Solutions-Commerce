import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import pool from "./db"



export const authOptions: NextAuthOptions = {

  providers: [

    CredentialsProvider({

      name: "credentials",

      credentials: {

        email: { label: "Email", type: "email" },

        password: { label: "Mot de passe", type: "password" }

      },

      async authorize(credentials) {

        if (!credentials?.email || !credentials?.password) {

          return null

        }



        try {

          const result = await pool.query(

            'SELECT * FROM users WHERE email = $1',

            [credentials.email]

          )



          const user = result.rows[0]



          if (!user || !user.password_hash) {

            return null

          }



          const isPasswordValid = await bcrypt.compare(

            credentials.password,

            user.password_hash

          )



          if (!isPasswordValid) {

            return null

          }



          // Update last login

          await pool.query(

            'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',

            [user.id]

          )



          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: user.avatar_url,
            role: user.role
          }

        } catch (error) {

          console.error("Auth error:", error)

          return null

        }

      }

    }),

    GoogleProvider({

      clientId: process.env.GOOGLE_CLIENT_ID!,

      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

    })

  ],

  callbacks: {

    async signIn({ user, account, profile }) {

      if (account?.provider === "google") {

        try {

          // Check if user already exists

          const existingUser = await pool.query(

            'SELECT * FROM users WHERE email = $1 OR (provider = $2 AND provider_id = $3)',

            [user.email, 'google', account.providerAccountId]

          )



          if (existingUser.rows.length === 0) {

            // Create new user

            await pool.query(

              `INSERT INTO users (prenom, name, email, avatar_url, provider, provider_id, email_verified, created_at) 

               VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)`,

              [

                (profile as any)?.given_name || user.name?.split(' ')[0] || '',

                user.name,

                user.email,

                user.image,

                'google',

                account.providerAccountId,

                (user as any).email_verified || false

              ]

            )

          } else {

            // Update last login

            await pool.query(

              'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',

              [existingUser.rows[0].id]

            )

          }

        } catch (error) {

          console.error("Google authentication failed")

          return false

        }

      }

      return true

    },

    async jwt({ token, user }) {

      if (user) {
        token.role = user.email === 'jadisara33@gmail.com' ? 'admin' : 'user'
        token.firstName = (user as any).firstName || undefined
        token.lastName = (user as any).lastName || undefined
        // Ensure avatar is available in session for both credentials and Google
        token.picture = (user as any).image || (user as any).avatar || (token as any).picture
      }

      return token

    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub || ''
        session.user.role = token.email === 'jadisara33@gmail.com' ? 'admin' : 'user'
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.image = (token as any).picture as string
      }
      return session
    }

  },

  session: {
    strategy: "jwt"

  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production'
        ? '__Host-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },

  pages: {

    signIn: "/connexion"

  }

}
