import easyinvoice from "easyinvoice";
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const folderPath = join(__dirname, '../../public/temp');
const filePath = join(folderPath, 'invoice.pdf');



export const CreateInvoice = () => {
    const data = {
        apiKey: "free",
        mode: "development",
        images: {
            logo: "https://storage.googleapis.com/mayavi_fashion1/footer_logo.png",
            // background: "white"
        },
        products: [
            {
                quantity: 2,
                description: "Test product",
                taxRate: 6,
                price: 33.87
            }
        ]
    };

    easyinvoice.createInvoice(data, function (result) {
        fs.writeFileSync(filePath, result.pdf, 'base64');
    });
};
