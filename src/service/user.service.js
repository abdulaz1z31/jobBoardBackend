import { db } from '../database/index.database.js'
import {
    comparePassword,
    generateHashPassword,
    createTokens,
    otpGenerator,
    sendMail,
    verifyTokens,
} from '../helpers/index.helpers.js'
//auth functions
export const registerUserService = async (userData) => {
    try {
        const { username, password } = userData

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

        if (check.isTrue) {
            return { success: true, userId }
        }

        return { success: false, error: check.error }
    } catch (error) {
        return { success: false, error: error.message }
    }
}
export const verifyUserService = async (userData) => {
    try {
        const { user_id, otp_code } = userData
        const { isExists, error, otp } = await findOtpById(user_id)

        if (!isExists) {
            return { success: false, error }
        }
        if (otp.otp_code != otp_code) {
            throw new Error('Otp is not valid')
        }
        const { isUpdated, err } = await updateUserStatus(user_id)

        if (!isUpdated) {
            throw new Error(err)
        }
        await deleteOtp(user_id)
        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}
export const loginUserService = async (userData) => {
    try {
        const { username, password } = userData
        const [user] = await db('users').select('*').where('username', username)

        if (!user) {
            throw new Error('User not found')
        }
        const isEqualPassword = await comparePassword(password, user.password)
        if (!isEqualPassword) {
            throw new Error('Username or password not valid')
        }
        const result = await isActive(user.id)
        console.log(result);
        
        if (!result.isActive) {
            throw new Error("Account not verified");
        }
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
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
        delete user.password
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
        const { email, id, username } = userData
        const [user] = await db('users').select('*').where('username', username)
        if (!user) {
            throw new Error('User not found')
        }
        const otp = otpGenerator()
        const result = await updateOtp(id, otp)
        const { isUpdated, error } = result

        if (!isUpdated) {
            return { success: false, error }
        }

        await sendMail(
            email,
            'Otp for change password',
            `<p><b>This key for updating your password: ${otp}</b></p>
            <p>"http://localhost:3000/api/v1/auth/change/password/${userData.id}"</p>`,
        )

        return { success: true }
    } catch (error) {
        return { success: false, error }
    }
}
export const changePasswordService = async (data, userId) => {
    try {
        const { newPassword, userOtp } = data
        const otpData = await findOtpById(userId)
        if (userOtp != otpData.otp_code) {
            throw new Error('Otp code not valid')
        }
        const hashPassword = await generateHashPassword(newPassword)
        const result = await updateUserPassword(userId, hashPassword)
        const { isUpdated, error } = result

        if (!isUpdated) {
            return { success: false, error }
        }
        return { success: true }
    } catch (error) {
        return { success: true, error }
    }
}
//user functions
export const getAllUsersService = async ({ limit, skip }) => {
    try {
        const users = await db('users').select('*').offset(skip).limit(limit)

        if (users.length == 0) {
            throw new Error('Users not found')
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
    try {
        await db('otp').insert({ otp_code, user_id })
        return { isTrue: true }
    } catch (error) {
        return { isTrue: false, error: error }
    }
}
const deleteOtp = async (user_id) => {
    try {
        await db('otp').where('user_id', user_id).del()
    } catch (error) {
        
    }
}
const findOtpById = async (user_id) => {
    try {
        const [otp] = await db
            .select('*')
            .from('otp')
            .where('user_id', '=', user_id)
        if (Object.keys(otp).length == 0) {
            throw new Error('Invalid user id')
        }
        return { isExists: true, otp }
    } catch (error) {
        return { isExists: true, error }
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
const updateOtp = async (user_id, otp_code) => {
    try {
        await db('otp').where('user_id', user_id).update({ otp_code })
        return { isUpdated: true }
    } catch (error) {
        return { isUPdated: false, error }
    }
}
const updateUserPassword = async (userId, hashPassword) => {
    try {
        await db('users').where('id', userId).update({ password: hashPassword })
        return { isUpdated: true }
    } catch (err) {
        return { isUpdated: false, err }
    }
}
const isActive = async (userId) => {
    try {
        const user = await db('users').select('status').where('id', userId)
        if (user.length < 1) {
            throw new Error("User not found");
        }
        if (user.status == 'active') {
            return {isActive:true}
        }
        return {isActive:false}
    } catch (error) {
        throw new Error(error); 
    }
}
