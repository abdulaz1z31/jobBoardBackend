/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    await knex.schema.createTable("skills", (table) => {
      table.uuid("id").primary();
      table.string("name").notNullable();
      table.uuid("category_id").references("id").inTable("categories").onDelete("CASCADE");
    });
  }
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export async function down(knex) {
    await knex.schema.dropTableIfExists("skills");
  }
  
