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
    const {Universities} = require('../data/major.json')
    Universities.forEach(data=>{
      delete(data.id)
      data.createdAt = new Date()
      data.updatedAt = new Date()
    })
    await queryInterface.bulkInsert('Universities', Universities)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Universities')
  }
};
