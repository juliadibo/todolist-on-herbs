const { createList } = require('./createList')
const { Ok, Err } = require('buchu')
const assert = require('assert')

describe('Create TO DO List', () => {

    function aUser({ hasAccess }) {
        return { canCreateList: hasAccess }
    }

    describe('Valid List', () => {

        it('Should Create List ', async () => {
            // Given
            const injection = {
                ListRepository: class ListRepository {
                    save(list) { return Ok(list) }
                }
            }
            const user = aUser({ hasAccess: true })
            const req = { name: "My favorite list" }

            // When
            const uc = createList(injection)
            uc.authorize(user)
            const ret = await uc.run({ name: req.name })

            // Then
            assert.ok(ret.isOk)
        })
    })

    describe('Invalid Name List', () => {

        it('Should Not Create List', async () => {
            // Given
            const injection = {
                ListRepository: class ListRepository {
                    save(list) { return Ok(list) }
                }
            }
            const user = aUser({ hasAccess: true })
            const req = { name: "" }

            // When
            const uc = createList(injection)
            uc.authorize(user)
            const ret = await uc.run({ name: req.name })

            // Then
            assert.ok(ret.isErr)
            assert.ok(ret.err.name[0] === "Name must be at least 3 characters")
        })
    })
})

