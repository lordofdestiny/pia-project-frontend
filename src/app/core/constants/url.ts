import { environment } from '@environments/environment';
const { serverPort } = environment;
import ipv4s from '@assets/ipv4.json';

export const baseServerUrl = `http://${ipv4s[0]}:${serverPort}`;
