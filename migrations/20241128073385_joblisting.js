/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable('joblisting', function (table) {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.string('title').notNullable()
        table.string('description').notNullable()
        table
            .uuid('company_id')
            .unsigned()
            .references('id')
            .inTable('companies')
            .onDelete('CASCADE')
            .onUpdate('CASCADE')
            .notNullable()
        table
            .uuid('category_id')
            .unsigned()
            .references('id')
            .inTable('categories')
            .onUpdate('CASCADE')
        table.string('location').notNullable()
        table.json('salaryRange').notNullable()
        table
            .enu('employmentType', [
                'full_time',
                'part_time',
                'contract',
                'temporary',
                'intership',
            ])
            .notNullable()
        table.jsonb('requirements').notNullable()
        table.enu('status', ['open', 'closed']).defaultTo('open').notNullable()
        table.timestamps(true, true)
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
    await knex.schema.dropTable('joblisting')
}
