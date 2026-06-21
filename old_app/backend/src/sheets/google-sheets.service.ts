import {Injectable} from "@nestjs/common";
import {google} from "googleapis";
import readline from "readline";
const {readFile, writeFile} = require('fs');
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// const TOKEN_PATH = './src/sheets/token.json';
// const CREDENTIALS_PATH = './src/sheets/credentials.json';
const TOKEN_PATH = './dist/sheets/token.json';
const CREDENTIALS_PATH = './dist/sheets/credentials.json';
const SPREADSHEET_RANGE = 'Copy of Products Wk1!A2:AA';
const RANGE_ = s => `${s}!A1:AA`;
const {wkCols, productCategories, categoryCol, prodSheetName} = require("./sheets_consts");
const {wkColsForApp, productCategoriesForApp, categoryColForApp, prodSheetNameForApp, prodSheetNameForAppNew} = require("./sheets_const_for_app");

@Injectable()
export class GoogleSheetsService {
    constructor() {
    }

    async authGoogleSheets() {
        return new Promise((resolve, reject) => {
            readFile(CREDENTIALS_PATH, {encoding: 'utf8'}, async (err, content) => {
                if (err) reject(`Error happened loading client secret file: ${err}`);
                const oauth2client = await this.authorizeGoogleSheets(JSON.parse(content.toString()));
                console.log('google auth success')
                resolve(oauth2client);
            });
        })
    }

    async getNewTokenGoogleSheets(oAuth2Client) {
        return new Promise((resolve, reject) => {
            const authUrl = oAuth2Client.generateAuthUrl({
                access_type: 'offline',
                scope: SCOPES
            });
            console.log('Authorize this app by visiting this url:', authUrl);
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question('Enter the code from that page here:', code => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) reject(`Error while trying to retrieve access token ${err}`);
                    oAuth2Client.setCredentials(token);
                    writeFile(TOKEN_PATH, JSON.stringify(token), err => {
                        if (err) reject(err);
                        console.log('Token stored to', TOKEN_PATH);
                    });
                    resolve(oAuth2Client);
                });
            });
        });
    }

    async authorizeGoogleSheets(credentials) {
        return await new Promise((resolve, reject) => {
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
            readFile(TOKEN_PATH, async (err, token) => {
                if (err) return this.getNewTokenGoogleSheets(oAuth2Client);
                oAuth2Client.setCredentials(JSON.parse(token.toString()));
                resolve(oAuth2Client);
                reject(res => {
                    //console.log('rejected');
                    //console.log('res:', res)
                })
            });
        });
    }

    async getSheetsRoutes(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    range: process.env.RANGE_ROUTES
                },
                (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const routes = rows.map(row => row.map(c => c && c.trim()))
                        // console.log('Import routes from sheets Routes:', routes)
                        resolve(routes);
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }

    async getSheetsProducts(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID_PRODUCTS,
                    range: RANGE_(prodSheetName)
                },
                (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const products = rows.map(row => row.map(c => c && c.trim()))
                        // console.log('Import products from sheets Sheet1:', products)
                        resolve(products);
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }

    async getSheetsProductsForApp(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID_PRODUCTS,
                    range: RANGE_(prodSheetNameForApp)
                },
                (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const products = rows.map(row => row.map(c => c && c.trim()))
                        // console.log('Import products from sheets "for app 2.0":', products)
                        resolve(products);
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }

    async getSheetsUsers(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    range: process.env.RANGE_USERS
                },
                async (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const trustedUsers = rows.map(
                            row => row.map(
                                cell => cell && cell.trim()
                            )
                        );
                        resolve(trustedUsers);
                    } else {
                        resolve('No data found.');
                    }
                });
        });
    }

    async getSheetsCategories(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    range: process.env.RANGE_CATEGORIES
                },
                async (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const categories = rows.map(
                            row => row.map(
                                cell => cell && cell.trim()
                            )
                        );
                        resolve(categories);
                    } else {
                        resolve('No data found.');
                    }
                });
        });
    }

    async getSheetsForUpdateProducts(auth, PRODUCT_SHEET) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID,
                    range: RANGE_(PRODUCT_SHEET)
                },
                async (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const products = rows.map(
                            row => row.map(
                                cell => cell && cell.trim()
                            )
                        );
                        resolve(products);
                    } else {
                        resolve('No data found.');
                    }
                });
        });
    }

    async updateSheet(auth, data, PRODUCT_SHEET) {
        const sheets = google.sheets({version: 'v4', auth});
        const request = {
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: RANGE_(PRODUCT_SHEET),
            valueInputOption: 'USER_ENTERED',
            resource: {
                values: data
            }
        }
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.update(
                request,
                (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    resolve(res);
                    //console.log('resolve(res):', resolve(res))
                });
        });
    }
    async importCategories() {
        const auth = await this.authGoogleSheets();
        return await this.getSheetsCategories(auth);
    }

    async importTrustedUsers() {
        const auth = await this.authGoogleSheets();
        return await this.getSheetsUsers(auth);
    }

    async importProducts(PRODUCT_SHEET) {
        const auth = await this.authGoogleSheets();
        const rows = await this.getSheetsProducts(auth);
        const productSheetFormatted = PRODUCT_SHEET.split(" ")[1] || "Wk1";
        // @ts-ignore
        return rows.filter((row) => {
            return (productCategories.includes(row[categoryCol]) && row[wkCols[productSheetFormatted]]);
        });
    }
    async exportProductsForApp(PRODUCT_SHEET) {
        const auth = await this.authGoogleSheets();
        const rows = await this.getSheetsProducts(auth);
        const productSheetFormatted = PRODUCT_SHEET.split(" ")[1] || "Wk1";
        // @ts-ignore
        return await rows.map((el,ind) =>{
            return el[0] && ( (productCategoriesForApp.includes(el[categoryColForApp]) && el[wkColsForApp[productSheetFormatted]]))?
                el:
                [];
        });
    }
    async importProductsForApp(PRODUCT_SHEET) {
        const auth = await this.authGoogleSheets();
        const rows = await this.getSheetsProductsForApp(auth);
        const productSheetFormatted = PRODUCT_SHEET.split(" ")[1] || "Wk1";
        // console.log('rows:', rows)
        // @ts-ignore
        return rows.filter((row) => {
            return (productCategoriesForApp.includes(row[categoryColForApp]) && row[wkColsForApp[productSheetFormatted]]);
        });
    }

    async importInventory(PRODUCT_SHEET) {
        const auth = await this.authGoogleSheets();
        const rows = await this.getSheetsProducts(auth);
        const productSheetFormatted = PRODUCT_SHEET.split(" ")[1] || "Wk1";
        // @ts-ignore
        return rows.filter((row) => {
            return (productCategoriesForApp.includes(row[categoryColForApp]) && row[wkColsForApp[productSheetFormatted]]);
        });
    }


    async importInventoryForApp(PRODUCT_SHEET) {
        const auth = await this.authGoogleSheets();
        const rows = await this.getSheetsProductsForApp(auth);
        const productSheetFormatted = PRODUCT_SHEET.split(" ")[1] || "Wk1";
        // @ts-ignore
        return rows.filter((row) => {
            return (productCategoriesForApp.includes(row[categoryColForApp]) && row[wkColsForApp[productSheetFormatted]]);
        });
    }
    async importRoutes() {
        const auth = await this.authGoogleSheets();
        const rowsRoutes = await this.getSheetsRoutes(auth);
        // @ts-ignore
        return rowsRoutes.reduce((acc, curVal, i) => {
            if (i === 0) {
                const arr = [];
                arr.push(curVal);
                acc.push(arr);
                return acc;
            }
            if (curVal.length === 0) {
                const arr = [];
                acc.push(arr);
                return acc;
            }
            acc[acc.length - 1].push(curVal);
            return acc;
        }, [])
    }

    async getSheetsProductsForAppAll(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.get(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID_PRODUCTS,
                    range: RANGE_(prodSheetNameForApp)
                },
                (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    const rows = res.data?.values;
                    if (rows && rows.length) {
                        const products = rows.map(row => row.map(c => c && c.trim()))
                        resolve(products);
                    } else {
                        resolve([]);
                    }
                }
            );
        });
    }

    async updateSheetForAppNewt(auth, data) {
        const sheets = google.sheets({version: 'v4', auth});
        //console.log('data:',data)
        return new Promise(function (resolve, reject) {
            sheets.spreadsheets.values.update(
                {
                    spreadsheetId: process.env.SPREADSHEET_ID_PRODUCTS,
                    range: RANGE_(prodSheetNameForApp),
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: data
                    }
                },
                (err, res) => {
                    if (err) reject('The API returned an error: ' + err);
                    resolve(res);
                });
        });
    }
}
