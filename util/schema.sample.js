/**
 *
 * this is project schema
 *
 * */
module.exports = require('graphql').buildSchema(`
        enum Breed {
            Abyssinian,
            Bombay,
            Shorthair
        },
        input KittenInput {
            name: String!,
            chipNumber: String!,
            breed: Breed!
        },
        type Kitten {
            id: ID,
            name: String,
            chipNumber: String,
            breed: Breed,
            createDate: Float,
            lastUpdate: Float
        },
        type Query {
            kittenGet(id: ID!): Kitten,
            kittenList: [Kitten],
            kittenSearch(text: String!): [Kitten],
            kittenGetByChipNumber(chipNumber: String): Kitten,
        },
        type Mutation {
            kittenCreate(input: KittenInput!): Kitten,
            kittenUpdate(id: ID!, input: KittenInput!): Kitten,
            kittenDelete(id: ID!): Kitten,
        }
    `);
