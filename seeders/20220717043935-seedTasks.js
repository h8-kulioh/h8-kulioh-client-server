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
     const {Tasks} = require('../data/ChaptersTask.json')
     Tasks.forEach(data=>{
       data.createdAt = new Date()
       data.updatedAt = new Date()
       delete data.id
     })
     await queryInterface.bulkInsert('Tasks', Tasks)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Tasks', {})

  }
};
