import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../../Backend/.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    const WaterReport = mongoose.model('WaterReport', new mongoose.Schema({ status: String, title: String, supplyArea: String, reportType: String }));
    const reports = await WaterReport.find({ supplyArea: 'Egerton University Area' });
    console.log(JSON.stringify(reports, null, 2));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
check();
