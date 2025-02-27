'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Maps', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('Maps', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
    await queryInterface.addColumn('Maps', 'sources', {
      type: Sequelize.JSON,
      allowNull: true,
    });
    await queryInterface.addColumn('Maps', 'is_public', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
    await queryInterface.addColumn('Maps', 'save_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    });
    // Add any other new columns here
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Maps', 'description');
    await queryInterface.removeColumn('Maps', 'tags');
    await queryInterface.removeColumn('Maps', 'sources');
    await queryInterface.removeColumn('Maps', 'is_public');
    await queryInterface.removeColumn('Maps', 'save_count');
    // Remove other columns if added above
  },
};
