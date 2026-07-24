// import contentful from 'contentful-management'
import { createClient } from 'contentful-management'

const client = createClient({
    // accessToken: 'CFPAT-Uhc2CaUP3pyWKPs4CzH9ygkNC-nbUIWB0SEhleMsUGg',
    accessToken: 'CFPAT-bBaEqHhE6FtPIVWcyhBrIKuRBu76ja-pYVzx4pt1ZA4' // production
})

export const uploadFiles = async (files) => {
    const fileUpload = await client
        .getSpace('re07v1jqbvra') // production
        // .getSpace('wn8ncefheaee')
        .then((space) => space.getEnvironment('master'))
        .then((environment) => environment.createAssetFromFiles({
            fields: {
                title: {
                    'en-US': 'Asset title'
                },
                description: {
                    'en-US': 'Asset description'
                },
                // file: file.file
                file: {
                    'en-US': {
                        contentType: files.type,
                        fileName: files.name,
                        file: files
                    }
                }
            }
        })
        )
        .then((asset) => asset.processForAllLocales())
        .then((asset) => asset.publish())
        .catch(console.error)

    return await fileUpload.fields.file['en-US']
}

