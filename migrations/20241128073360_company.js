/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('companies', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.string('name').notNullable().unique()
        table.string('email').notNullable().unique()
        table.text('description').notNullable()
        table.string('website').notNullable()
        table.string('location').notNullable()
        table.uuid('user_id').notNullable()
        table.string('industry').notNullable()
        table.integer('size').notNullable()
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
