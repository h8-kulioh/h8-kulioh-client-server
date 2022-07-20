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

     const questionWeekly = require('../data/questionWeekly.json').Sheet1
     questionWeekly.forEach((data)=>{
       data.createdAt = new Date()
       data.updatedAt = new Date()
       delete data.id
     })
     await queryInterface.bulkInsert('QuestionWeeklyTests', questionWeekly, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('QuestionWeeklyTests', null, {})

  }
};
