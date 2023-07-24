import express from 'express';
import { DeviceController } from '../controllers/device.controller'
export const DeviceRouter = express.Router();

DeviceRouter.get('/', DeviceController.getMobileDesktopPercentage)