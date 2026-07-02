import filteredList from './helpers/filteredList.ts';
import type { IPost } from '../types/post.d.ts';
import type { TRouter, TTarget } from '../types/router.d.ts';
import {
  getDateNumber as domainGetDateNumber,
  formatDateWithWeekday,
  reverseDate as domainReverseDate
} from '../domain/common/date.domain';
import { getActiveStyle } from '../domain/common/router.domain';

export { filteredList };

export const reverseDate = domainReverseDate;
export const getDateNumber = domainGetDateNumber;

export const getStyle = (router: TRouter, styles: { activeLink: string }, target: TTarget) =>
  getActiveStyle(router, styles, target);

export const formatArticlePublishedDate = (post: IPost) => {
  const { pubDate, published } = post.frontmatter;
  const date = pubDate || published;
  return formatDateWithWeekday(String(date));
};

export const formatDateWithOptions = (date: string) => formatDateWithWeekday(date);
