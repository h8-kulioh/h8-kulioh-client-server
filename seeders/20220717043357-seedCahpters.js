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
     const {Chapters} = require('../data/ChaptersTask.json')
     Chapters.forEach(data=>{
       data.createdAt = new Date()
       data.updatedAt = new Date()
       delete data.id
     })
     await queryInterface.bulkInsert('Chapters', Chapters)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Chapters', {})

  }
};
