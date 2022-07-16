'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const questionKey = require('../data/questionKey.json')
     questionKey.QuestionKeys.forEach(data=>{
      data.createdAt = new Date()
      data.updatedAt = new Date()
     })
     await queryInterface.bulkInsert('QuestionKeys', questionKey.QuestionKeys)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('QuestionKeys')
  }
};
