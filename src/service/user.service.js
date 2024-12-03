import { db } from '../database/index.database.js'
import {
    comparePassword,
    generateHashPassword,
    createTokens,
    otpGenerator,
    sendMail,
    verifyTokens,
    createForgetToken,
} from '../helpers/index.helpers.js'
//auth functions
export const registerUserService = async (userData) => {
    try {
        const { username, password, role } = userData
        if (role == 'admin' || role == 'superAdmin') {
            userData.role = 'job_seeker'
        }
        const user = await db('users').where('username', username)

        if (user.length != 0) {
            throw new Error('User already exists')
        }

        const otp = otpGenerator()
        await sendMail(
            userData.email,
            'Your one-time password',
            `<h1><b>YOUR ONE TIME PASSWORD IS => ${otp}</b></h1>`,
        )

        const newPassword = await generateHashPassword(password)

        const [userId] = await db('users')
            .insert({ ...userData, password: newPassword })
            .returning('id')

        const check = await createOtp(otp, userId.id)

        if (check.isCreated) {
            return { success: true, userId }
        }

        return { success: false, error: check.error }
    } catch (error) {
        return { success: false, error: error.message }
    }
}
export const verifyUserService = async (userData) => {
    try {
        const now = new Date()
        const { user_id, otp_code } = userData
        const { isExists, error, otp } = await findOtpById(user_id)

        if (!isExists) {
            return { success: false, error }
        }
        if (otp.otp_code != otp_code) {
            throw new Error('Otp is not valid')
        }
        if (now > otp.expires_at) {
            throw new Error('Otp expired')
        }
        await deleteOtp(user_id)
        const { isUpdated, err } = await updateUserStatus(user_id)
        if (!isUpdated) {
            throw new Error(err)
        }
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}
export const loginUserService = async (userData) => {
    try {
        const { username, password, email } = userData
        let user
        if (username) {
            user = await db('users').select('*').where('username', username)
        } else {
            user = await db('users').select('*').where('email', email)
        }
        if (!user) {
            throw new Error('User not found')
        }
        const isEqualPassword = await comparePassword(
            password,
            user[0].password,
        )
        if (!isEqualPassword) {
            throw new Error('Username or password not valid')
        }
        const result = await isActive(user[0].id)
        if (!result.isActive) {
            throw new Error('Account not verified')
        }
        const payload = {
            id: user[0].id,
            username: user[0].username,
            email: user[0].email,
            role: user[0].role,
            status: user[0].status,
        }

        const token = await createTokens(payload)
        return { success: true, token }
    } catch (error) {
        return { success: false, error }
    }
}
export const getUserProfileService = async (userData) => {
    try {
        const { username } = userData

        const user = await db('users').select('*').where('username', username)

        if (!user) {
            throw new Error('User not found')
        }
        delete user[0].password
        return { success: true, user }
    } catch (error) {
        return { success: false, error }
    }
}
export const updateTokenService = async (refreshToken) => {
    const decode = verifyTokens('refresh', refreshToken)
    delete decode.exp
    const token = await createTokens(decode)
    return token
}
export const forgetPasswordService = async (userData) => {
    try {
        const { email, username } = userData
        let user
        if (username) {
            user = await db('users').select('*').where('username', username)
        } else {
            user = await db('users').select('*').where('email', email)
        }
        if (user.length == 0) {
            throw new Error('User not found')
        }
        const otp = otpGenerator()
        const result = await createOtp(otp, user[0].id)
        const { isCreated, error } = result

        if (!isCreated) {
            return { success: false, error }
        }

        await sendMail(
            user[0].email,
            'Otp for change password',
            `<p><b>This key for updating your password: ${otp}</b></p>`,
        )
        const payload = {
            id: user[0].id,
            email: user[0].email,
            role: user[0].role,
            status: user[0].status,
        }
        const forgetToken = await createForgetToken(payload)
        return { success: true, forgetToken }
    } catch (error) {
        return { success: false, error }
    }
}
export const forgetPasswordChangeService = async (userData, newData) => {
    try {
        const { newPassword, userOtp } = newData
        const otpData = await findOtpById(userData.id)
        if (userOtp != otpData.otp_code) {
            throw new Error('Otp code not valid')
        }
        const hashPassword = await generateHashPassword(newPassword)
        const result = await updateUserPassword(userData.id, hashPassword)

        const { isUpdated, error } = result
        if (!isUpdated) {
            return { success: false, error }
        }
        const now = new Date()
        if (now > otpData.expires_at) {
            throw new Error('Otp is expired')
        }
        await deleteOtp(userData.id)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}
export const changePasswordService = async (userData, body) => {
    try {
        const user = await db('users').select('*').where('id', userData.id)
        if (user.length == 0) {
            throw new Error('User not found')
        }
        const newPassword = body.password
        const hashPassword = await generateHashPassword(newPassword)
        user[0].password = hashPassword
        await db('users').update(user[0]).where('id', userData.id)
        return { success: true }
    } catch (error) {
        return { success: true, error }
    }
}
//admin fuctions
export const createAdminService = async (data) => {
    try {
        data.role = 'admin'
        const hashPassword = await generateHashPassword(data.password)
        data.password = hashPassword
        data.status = 'active'
        const admin = await db('users').insert(data).returning('*')

        if (admin.length == 0) {
            throw new Error('Error while creating admin')
        }
        delete admin[0].password
        return { success: true, admin }
    } catch (error) {
        return { success: false, error }
    }
}
export const deleteAdminService = async (userId) => {
    try {
        await db('users').where('id', userId).del()
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}
//user functions
export const getAllUsersService = async ({ limit, skip }) => {
    try {
        const users = await db('users').select('*').offset(skip).limit(limit)
        if (users.length == 0) {
            throw new Error('Users not found')
        }
        // eslint-disable-next-line prefer-const
        for (let user of users) {
            delete user.password
        }
        return { success: true, users }
    } catch (error) {
        return { success: false, error }
    }
}
export const searchUserService = async (query) => {
    try {
        const { username } = query
        const users = await db('users')
            .select('*')
            .where('username', 'ILIKE', `%${username}%`)
        if (users.length == 0) {
            return { success: true }
        }
        return { success: true, users }
    } catch (error) {
        return { success: true, error }
    }
}
export const getUserByIdService = async (userId) => {
    try {
        const [user] = await db('users').select('*').where('id', userId)
        if (!user) {
            throw new Error('User not found')
        }
        delete user.password
        return { success: true, user }
    } catch (error) {
        return { success: false, error }
    }
}
export const updateUserByIdService = async (userId, newData) => {
    try {
        const [user] = await db('users').select('*').where('id', userId)
        if (!user) {
            throw new Error('User not found')
        }
        const userPassword = newData?.password
        if (userPassword) {
            const hashPassword = await generateHashPassword(userPassword)
            newData.password = hashPassword
        }
        const newUser = await db('users')
            .where('id', userId)
            .update(newData)
            .returning('*')
        if (!newUser) {
            throw new Error('Error while updating user')
        }

        return { success: true, newUser }
    } catch (error) {
        return { success: false, error }
    }
}
export const deleteUserByIdService = async (userId) => {
    try {
        await db('users').where('id', userId).del()
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}

//helper functions
const createOtp = async (otp_code, user_id) => {
    const expirationTime = new Date(Date.now() + 2 * 60 * 1000)
    try {
        await db('otp').insert({
            otp_code,
            user_id,
            expires_at: expirationTime,
        })
        return { isCreated: true }
    } catch (error) {
        return { isCreated: false, error: error }
    }
}
const deleteOtp = async (user_id) => {
    try {
        await db('otp').where('user_id', user_id).del()
    } catch (error) {}
}
const findOtpById = async (user_id) => {
    try {
        const otp = await db
            .select('*')
            .from('otp')
            .where('user_id', '=', user_id)
        if (otp.length == 0) {
            throw new Error('Otp not found')
        }
        return { isExists: true, otp: otp[0] }
    } catch (error) {
        return { isExists: false, error }
    }
}
const updateUserStatus = async (userId) => {
    try {
        await db('users').where('id', userId).update({ status: 'active' })
        return { isUpdated: true }
    } catch (err) {
        return { isUpdated: false, err }
    }
}
const updateUserPassword = async (userId, hashPassword) => {
    try {
        await db('users').update({ password: hashPassword }).where('id', userId)
        return { isUpdated: true }
    } catch (err) {
        return { isUpdated: false, err }
    }
}
const isActive = async (userId) => {
    try {
        const user = await db('users').select('*').where('id', userId)
        if (user.length < 1) {
            throw new Error('User not found')
        }
        if (user[0].status == 'active') {
            return { isActive: true }
        }
        return { isActive: false }
    } catch (error) {
        throw new Error(error)
    }
}
