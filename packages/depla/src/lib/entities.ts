import { IEntity } from './types.js';

export const userSchema: IEntity = {
  ref: 'User',
  refs: 'Users',
  model: 'user',
  models: 'users',
};

export const postSchema: IEntity = {
  ref: 'Post',
  refs: 'Posts',
  model: 'post',
  models: 'posts',
};

export const homeSchema: IEntity = {
  ref: 'Home',
  refs: 'Homes',
  model: 'home',
  models: 'home',
};

export const loginSchema: IEntity = {
  ref: 'Login',
  refs: 'Logins',
  model: 'login',
  models: 'login',
};
