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

     const {VideoDaily} = require('../data/videoPremium.json')
     VideoDaily.forEach(data=>{
       data.createdAt = new Date()
       data.updatedAt = new Date()
     })
     await queryInterface.bulkInsert('VideoPremia', VideoDaily, {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkInsert('VideoPremia', null, {})

  }
};
