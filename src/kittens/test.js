/**
 * Sample test class
 */
const assert = require('chai').assert;
const initData = require('../util/test').initData;

module.exports = {
    test: (methods) => {

        /**
         * clean previous data
         */
        before(initData);

        describe('kitten', () => {
            let id1;
            let createDate1;
            const createData = {
                name: "Kitten 1",
                chipNumber: "K0001",    
                breed: "Bombay"
            };

            const queryResultExpected = "{id, name, breed, chipNumber, createDate, lastUpdate}";
            const listQuery = {query:"{kittenList "+queryResultExpected+"}"};

            describe('emptyList', () => {
                it('success', done => {
                    methods.queryWithCredentials(listQuery)
                        .end((err, res) => {
                            assert.lengthOf(res.body.data.kittenList, 0);
                            done();
                        });
                });
            });

            describe('create', () => {

                it('success', done => {
                    const createQuery = {query:"mutation {kittenCreate(input:{" +
                            "name: \""+createData.name+"\"" +
                            "chipNumber: \""+createData.chipNumber+"\"" +
                            "breed: "+createData.breed +
                            "})"+queryResultExpected+"}"};

                    methods.queryWithAdminCredentials(createQuery)
                        .end((err, res) => {
                            assert.isNotEmpty(res.body.data.kittenCreate.id);
                            assertObjectWithoutId(res.body.data.kittenCreate, createData);
                            id1 = res.body.data.kittenCreate.id;
                            createDate1 = res.body.data.kittenCreate.createDate;
                            done();
                        });
                });

                it('emptyName', done => {
                    const createQuery = {query:"mutation {kittenCreate(input:{" +
                            "chipNumber: \"K0001\"" +
                            "breed: Bombay" +
                            "})"+queryResultExpected+"}"};

                    methods.queryWithAdminCredentials(createQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'Field "KittenInput.name" of required type "String!" was not provided.');
                            done();
                        });
                });

                it('emptyChipNumber', done => {
                    const createQuery = {query:"mutation {kittenCreate(input:{" +
                            "name: \"Kitten 1\"" +
                            "breed: Bombay" +
                            "})"+queryResultExpected+"}"};

                    methods.queryWithAdminCredentials(createQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'Field "KittenInput.chipNumber" of required type "String!" was not provided.');
                            done();
                        });
                });

                it('emptyBreed', done => {
                    const createQuery = {query:"mutation {kittenCreate(input:{" +
                            "name: \"Kitten 1\"" +
                            "chipNumber: \"K0001\"" +
                            "})"+queryResultExpected+"}"};

                    methods.queryWithAdminCredentials(createQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'Field "KittenInput.breed" of required type "Breed!" was not provided.');
                            done();
                        });
                });

                it('invalidBreed', done => {
                    const createQuery = {query:"mutation {kittenCreate(input:{" +
                            "name: \""+createData.name+"\"" +
                            "chipNumber: \""+createData.chipNumber+"\"" +
                            "breed: abc" +
                            "})"+queryResultExpected+"}"};

                    methods.queryWithAdminCredentials(createQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'Value "abc" does not exist in "Breed" enum.');
                            done();
                        });
                });

                it('nonAdmin', done => {
                    const createQuery = {query:"mutation {kittenCreate(input:{" +
                            "name: \""+createData.name+"\"" +
                            "chipNumber: \""+createData.chipNumber+"\"" +
                            "breed: "+createData.breed +
                            "})"+queryResultExpected+"}"};

                    methods.queryWithCredentials(createQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'permission-denied');
                            done();
                        });
                });

            });

            describe('afterCreate', () => {
                it('get', done => {
                    const getQuery = {query:"{kittenGet(id: \""+id1+"\") "+queryResultExpected+"}"};
                    methods.queryWithCredentials(getQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenGet, id1, createData);
                            done();
                        });
                });

                it('list', done => {
                    methods.queryWithCredentials(listQuery)
                        .end((err, res) => {
                            assertList(res.body.data.kittenList, id1, createData);
                            done();
                        });
                });

                it('search', done => {
                    const searchQuery = {query:"{kittenSearch(text: \"tten\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(searchQuery)
                        .end((err, res) => {
                            assertList(res.body.data.kittenSearch, id1, createData);
                            done();
                        });
                });

                it('searchByChipNumber', done => {
                    const searchQuery = {query:"{kittenGetByChipNumber(chipNumber: \""+createData.chipNumber+"\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(searchQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenGetByChipNumber, id1, createData);
                            done();
                        });
                });

            });

            describe('update', () => {
                const getUpdateQuery = (id, data) => {
                    return {query:"mutation {kittenUpdate(id: \""+id+"\", input:{" +
                            "name: \""+data.name+"\"" +
                            "chipNumber: \""+data.chipNumber+"\"" +
                            "breed: "+data.breed +
                            "})"+queryResultExpected+"}"};
                };

                const updateData = {
                    name: "Kitten 2",
                    chipNumber: createData.chipNumber,
                    breed: createData.breed
                };

                it('updateName', done => {
                    const updateQuery = getUpdateQuery(id1, updateData);
                    methods.queryWithAdminCredentials(updateQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenUpdate, id1, updateData);
                            assert.isAbove(res.body.data.kittenUpdate.lastUpdate, res.body.data.kittenUpdate.createDate);
                            done();
                        });
                });

                it('updateChipNumber', done => {
                    updateData.chipNumber = "K0002";
                    const updateQuery = getUpdateQuery(id1, updateData);
                    methods.queryWithAdminCredentials(updateQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenUpdate, id1, updateData);
                            assert.isAbove(res.body.data.kittenUpdate.lastUpdate, res.body.data.kittenUpdate.createDate);
                            done();
                        });
                });

                it('updateBreed', done => {
                    updateData.breed = "Shorthair";
                    const updateQuery = getUpdateQuery(id1, updateData);
                    methods.queryWithAdminCredentials(updateQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenUpdate, id1, updateData);
                            assert.isAbove(res.body.data.kittenUpdate.lastUpdate, res.body.data.kittenUpdate.createDate);
                            done();
                        });
                });

                it('updateAll', done => {
                    const updateData = {
                        name: "Kitten 3",
                        chipNumber: "K0003",
                        breed: "Abyssinian"
                    };
                    const updateQuery = getUpdateQuery(id1, updateData);
                    methods.queryWithAdminCredentials(updateQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenUpdate, id1, updateData);
                            assert.isAbove(res.body.data.kittenUpdate.lastUpdate, res.body.data.kittenUpdate.createDate);
                            done();
                        });
                });

                it('nonAdmin', done => {
                    updateData.name = "Kitten 2";
                    const updateQuery = getUpdateQuery(id1, updateData);
                    methods.queryWithCredentials(updateQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'permission-denied');
                            done();
                        });
                });

                it('notExists', done => {
                    updateData.name = "Kitten 2";
                    const updateQuery = getUpdateQuery("608933b82a44b4e0d75fdb25", updateData);
                    methods.queryWithCredentials(updateQuery)
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'permission-denied');
                            done();
                        });
                });
            });

            describe('afterUpdate', () => {
                const updateData = {
                    name: "Kitten 3",
                    chipNumber: "K0003",
                    breed: "Abyssinian"
                };

                it('get', done => {
                    const getQuery = {query:"{kittenGet(id: \""+id1+"\") "+queryResultExpected+"}"};
                    methods.queryWithCredentials(getQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenGet, id1, updateData);
                            done();
                        });
                });

                it('list', done => {
                    methods.queryWithCredentials(listQuery)
                        .end((err, res) => {
                            assertList(res.body.data.kittenList, id1, updateData);
                            done();
                        });
                });

                it('search', done => {
                    const searchQuery = {query:"{kittenSearch(text: \"tten 3\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(searchQuery)
                        .end((err, res) => {
                            assertList(res.body.data.kittenSearch, id1, updateData);
                            done();
                        });
                });

                it('searchByChipNumber', done => {
                    const searchQuery = {query:"{kittenGetByChipNumber(chipNumber: \""+updateData.chipNumber+"\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(searchQuery)
                        .end((err, res) => {
                            assertObject(res.body.data.kittenGetByChipNumber, id1, updateData);
                            done();
                        });
                });

            });

            describe('delete', () => {
                const getDeleteQuery = (id) => {
                    return {query:"mutation {kittenDelete(id: \""+id+"\")"+queryResultExpected+"}"};
                };

                it('nonAdmin', done => {
                    methods.queryWithCredentials(getDeleteQuery(id1))
                        .end((err, res) => {
                            assert.equal(res.body.errors[0].message, 'permission-denied');
                            done();
                        });
                });

                it('notExists', done => {
                    methods.queryWithAdminCredentials(getDeleteQuery("6076bdf7360168b52ad2e781"))
                        .end((err, res) => {
                            assert.isNull(res.body.data.kittenDelete);
                            done();
                        });
                });

                it('success', done => {
                    methods.queryWithAdminCredentials(getDeleteQuery(id1))
                        .end((err, res) => {
                            assert.notProperty(res.body.data.kittenDelete.id, id1);
                            done();
                        });
                });

            });

            describe('afterDelete', () => {

                it('get', done => {
                    const getQuery = {query:"{kittenGet(id: \""+id1+"\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(getQuery)
                        .end((err, res) => {
                            assert.isNull(res.body.data.kittenGet);
                            done();
                        });
                });

                it('list', done => {
                    methods.queryWithCredentials(listQuery)
                        .end((err, res) => {
                            assert.lengthOf(res.body.data.kittenList, 0);
                            done();
                        });
                });

                it('search', done => {
                    const searchQuery = {query:"{kittenSearch(text: \"tten 3\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(searchQuery)
                        .end((err, res) => {
                            assert.lengthOf(res.body.data.kittenSearch, 0);
                            done();
                        });
                });

                it('searchByChipNumber', done => {
                    const searchQuery = {query:"{kittenGetByChipNumber(chipNumber: \"K0003\") "+queryResultExpected+"}"};

                    methods.queryWithCredentials(searchQuery)
                        .end((err, res) => {
                            assert.isNull(res.body.data.kittenGetByChipNumber);
                            done();
                        });
                });

            });


        });
    }
};

const assertObjectWithoutId = (response, data) => {
    assert.equal(response.name, data.name);
    assert.equal(response.chipNumber, data.chipNumber);
    assert.equal(response.breed, data.breed);
    assert.isAbove(response.createDate, 0);
    assert.isAbove(response.lastUpdate, 0);
};

const assertObject = (response, id, data) => {
    assert.equal(response.id, id);
    assertObjectWithoutId(response, data);
};

const assertList = (response, id, data) => {
    assert.lengthOf(response, 1);
    assert.equal(response[0].id, id);
    assert.equal(response[0].name, data.name);
    assert.equal(response[0].chipNumber, data.chipNumber);
    assert.equal(response[0].breed, data.breed);
    assert.isAbove(response[0].createDate, 0);
    assert.isAbove(response[0].lastUpdate, 0);
};