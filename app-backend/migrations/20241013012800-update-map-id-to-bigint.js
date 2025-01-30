'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Drop the primary key constraint using its actual name
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Maps_pkey') THEN
          ALTER TABLE "Maps" DROP CONSTRAINT "Maps_pkey";
        END IF;
      END$$;
    `);

    // Change the column type to BIGINT
    await queryInterface.sequelize.query(`
      ALTER TABLE "Maps" ALTER COLUMN "id" TYPE BIGINT
    `);

    // Set a default sequence for the BIGINT column
    await queryInterface.sequelize.query(`
      CREATE SEQUENCE IF NOT EXISTS map_id_seq OWNED BY "Maps"."id"
    `);
    
    await queryInterface.sequelize.query(`
      ALTER TABLE "Maps" ALTER COLUMN "id" SET DEFAULT nextval('map_id_seq')
    `);

    // Add primary key constraint back
    await queryInterface.sequelize.query(`
      ALTER TABLE "Maps" ADD CONSTRAINT "Maps_pkey" PRIMARY KEY ("id")
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // Drop the primary key constraint if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'Maps_pkey') THEN
          ALTER TABLE "Maps" DROP CONSTRAINT "Maps_pkey";
        END IF;
      END$$;
    `);

    // Revert the column type back to INTEGER
    await queryInterface.sequelize.query(`
      ALTER TABLE "Maps" ALTER COLUMN "id" TYPE INTEGER
    `);

    // Remove the default sequence for the column
    await queryInterface.sequelize.query(`
      ALTER TABLE "Maps" ALTER COLUMN "id" DROP DEFAULT
    `);

    // Add primary key constraint back
    await queryInterface.sequelize.query(`
      ALTER TABLE "Maps" ADD CONSTRAINT "Maps_pkey" PRIMARY KEY ("id")
    `);
  }

  
};


