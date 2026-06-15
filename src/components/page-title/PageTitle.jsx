import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { getRouteLanguage } from '../../utils/language';

const SITE_NAME = 'Malnbadens Camping';

const PAGE_TITLE_KEYS = {
  '/home': 'meta.title',
  '/accommodation/camping': 'accommodation.campingPage.title',
  '/accommodation/cottages': 'accommodation.cottagesPage.title',
  '/accommodation/hostel': 'accommodation.hostelPage.title',
  '/activities': 'activitiesPage.title',
  '/restaurant': 'navbar.restaurant',
  '/opening-hours': 'navbar.openingHours',
  '/24sju-butik': 'shopPage.meta.title',
};

function PageTitle() {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const routeLanguage = getRouteLanguage(pathname);
  const titleLanguage = routeLanguage || i18n.resolvedLanguage;
  const routePath = pathname.replace(/^\/[^/]+/, '') || '/home';

  useEffect(() => {
    const titleKey = PAGE_TITLE_KEYS[routePath];
    const translateTitle = (key) => t(key, { lng: titleLanguage });

    if (titleKey === 'meta.title' || titleKey === 'shopPage.meta.title') {
      document.title = translateTitle(titleKey);
      return;
    }

    if (titleKey) {
      const pageTitle = translateTitle(titleKey).replace(/\.{3}$/, '');
      document.title = `${pageTitle} | ${SITE_NAME}`;
      return;
    }

    document.title = SITE_NAME;
  }, [routePath, t, titleLanguage]);

  return null;
}

export default PageTitle;
