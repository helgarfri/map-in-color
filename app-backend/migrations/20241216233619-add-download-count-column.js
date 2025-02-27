'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Maps', 'download_count', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Maps', 'download_count');
  }
};
