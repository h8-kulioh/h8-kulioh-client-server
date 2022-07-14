'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addConstraint('QuestionKeyWeeklyTests', {
      fields: ['QuestionWeeklyTestId'],
      type: 'foreign key',
      name: 'fk_QuestionWeeklyTest',
      references: { //Required field
        table: 'QuestionWeeklyTests',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint('QuestionKeyWeeklyTests', 'fk_QuestionWeeklyTest')
  }
};
