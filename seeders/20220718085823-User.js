'use strict';

const { hashPass } = require('../helpers/jwt&bcrypt');

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
     const User = require('../data/user.json')
     User.forEach(data=>{
       data.createdAt = new Date()
       data.updatedAt = new Date()
       data.password = hashPass(data.password)
     })
     await queryInterface.bulkInsert('Users', User)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('Users', {})

  }
};
