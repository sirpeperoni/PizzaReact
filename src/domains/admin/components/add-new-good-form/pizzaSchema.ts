import { z } from 'zod';

export const pizzaSchema = z.object({
  title: z.string().min(2, 'Название должно содержать минимум 2 символа').max(50, 'Название не более 50 символов'),
  content: z.string().min(10, 'Описание должно содержать минимум 10 символов').max(500, 'Описание не более 500 символов'),
  img: z
    .string()
    .min(1, 'Имя файла изображения обязательно')
    .regex(/\.(jpg|jpeg|png|webp)$/i, 'Формат должен быть jpg, jpeg, png или webp'),
  price: z.array(z.number().min(0, 'Цена должна быть положительной')),
  sizes: z.array(z.string().min(1, 'Размер не может быть пустым')),
  dough: z.array(z.string().min(1, 'Тип теста не может быть пустым')),
});

export type PizzaFormData = z.infer<typeof pizzaSchema>;
export const sizes = ['20 СМ', '25 СМ', '30 СМ', '35 СМ'];
export const doughs = ['Тонкое', 'Традиционное'];
