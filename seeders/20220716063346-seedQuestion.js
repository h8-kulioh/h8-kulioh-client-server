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
    const question = require('../data/question.json')
    question.Sheet1.forEach((data)=>{
      delete(data.id)
      data.createdAt = new Date()
      data.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Questions', question.Sheet1)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Questions')
  }
};
