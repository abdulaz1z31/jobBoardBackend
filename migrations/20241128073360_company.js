/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('companies', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.string('name').notNullable().unique()
        table.string('email').notNullable().unique()
        table.text('description')
        table.string('website')
        table.string('location')
        table.uuid('user_id').references('id').inTable('users').notNullable()
        table.string('industry')
        table.integer('size')
        table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable('companies')
}
