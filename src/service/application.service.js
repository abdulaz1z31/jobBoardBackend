import { db } from '../database/index.database.js'

export const getAllApplicationService = async () => {
    try {
        const data = await db.select('*').from('application').returning('*')
        if (!data) {
            throw new Error('Error')
        }
        return data
    } catch (error) {
        throw new Error(error)
    }
}
export const getByIdApplicationService = async (id) => {
    try {
        const data = await db
            .select('*')
            .from('application')
            .returning('*')
            .where('id', '=', id)
            .returning('*')
        if (!data[0]) {
            throw new Error('Error')
        }
        return data[0]
    } catch (error) {
        throw new Error(error)
    }
}
export const createApplicationService = async (body) => {
    try {
        const newData = await db('application').insert({ ...body })
        if (!newData[0]) {
            throw new Error('Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}
export const updateApplicationService = async (id, body) => {
    try {
        const updateData = await db('application')
            .where('id', '=', id)
            .update(body)
            .returning('*')
        if (!updateData[0]) {
            throw new Error('Error')
        }
        return updateData[0]
    } catch (error) {
        throw new Error(error)
    }
}
export const deleteApplicationService = async (id) => {
    try {
        const deleteData = await db('application').where('id', '=', id).del()
        if (!deleteData[0]) {
            throw new Error('Error')
        }
        return deleteData[0]
    } catch (error) {
        throw new Error(error)
    }
}
