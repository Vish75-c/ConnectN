import axois from 'axois';

import { HOST } from '@/utils/constants';

const apiClient=axois.create({
    baseURL:HOST,
})