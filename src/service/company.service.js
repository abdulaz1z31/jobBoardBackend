import { db } from '../database/index.database.js'

export const getAllCompanyService = async ({ skip, limit }) => {
    try {
        const data = await db
            .select('*')
            .from('companies')
            .offset(skip)
            .limit(limit)
        if (!data) {
            throw new Error('Error')
        }
        return data
    } catch (error) {
        throw new Error(error)
    }
}

export const getByICompanyService = async (id) => {
    try {
        const data = await db.select('*').from('companies').where('id', '=', id)
        if (!data[0]) {
            throw new Error('Error')
        }
        return data[0]
    } catch (error) {
        throw new Error(error.message)
    }
}
export const searchCompanyService = async (query) => {
    try {
        const { name } = query
        const companies = await db('companies')
            .select('*')
            .where('name', 'ILIKE', `%${name}%`)
        return { success: true, companies }
    } catch (error) {
        return { success: false, error }
    }
}
export const registerCompanyService = async (data, userId) => {
    try {
        const id = userId
        const hasCompany = await db
            .select('*')
            .from('companies')
            .where('name', data.name)
        if (!hasCompany[0]) {
            const regsitrationCompany = await db('companies')
                .insert({ ...data, user_id: id })
                .returning('*')
            if (!regsitrationCompany[0]) {
                throw new Error('Company Registration failed with error')
            }
            return regsitrationCompany[0].id
        }
        throw new Error('Company already exists')
    } catch (error) {
        throw new Error(error.message)
    }
}

export const updateCompanyService = async (id, body) => {
    try {
        const data = await db('companies')
            .where('id', id)
            .update(body)
            .returning('*')
        if (!data[0]) {
            throw new Error('Error')
        }
        return data
    } catch (error) {
        throw new Error(error)
    }
}
export const deleteCompanyService = async (id) => {
    try {
        const data = await db('companies').where('id', id).del().returning('*')
        if (!data) {
            throw new Error('Error')
        }
        return data
    } catch (error) {
        throw new Error(error)
    }
}
