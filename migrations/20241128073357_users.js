/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    await knex.schema.createTable('users', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.string('name'), table.string('username')
        table.string('email').notNullable()
        table.string('password').notNullable()
        table
            .enum('role', ['admin', 'job_seeker', 'recruiter'])
            .defaultTo('job_seeker')
        table.enum('status', ['active', 'inactive']).defaultTo('inactive')
        table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable('users')
}
