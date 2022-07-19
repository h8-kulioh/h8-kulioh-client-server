'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addConstraint('AnswerWeeklyTests', {
      fields: ['userAnswer'],
      type: 'foreign key',
      name: 'fk_QuestionKeyWeeklyTest',
      references: { //Required field
        table: 'QuestionKeyWeeklyTests',
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
    await queryInterface.removeConstraint('AnswerWeeklyTests', 'fk_QuestionKeyWeeklyTest')
  }
};
