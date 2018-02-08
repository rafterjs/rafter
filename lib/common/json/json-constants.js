const DATA = 'data';
const ID = `${DATA}.id`;
const TYPE = `${DATA}.type`;
const ATTRIBUTES = `${DATA}.attributes`;
const METADATA = 'meta';
const METADATA_PAGE = `${METADATA}.page`;
const METADATA_PAGE_OFFSET = `${METADATA_PAGE}.offset`;
const METADATA_PAGE_LIMIT = `${METADATA_PAGE}.limit`;
const METADATA_PAGE_TOTAL = `${METADATA_PAGE}.total`;
const LINKS = 'links';
const LINKS_SELF = `${LINKS}.self`;
const FILTER = `filter`;
const PAGE = `page`;
const PAGE_OFFSET = `${PAGE}.offset`;
const PAGE_LIMIT = `${PAGE}.limit`;
const SORT = `sort`;

const SORT_QUALIFIER = {
    ASCENDING: '+',
    DESCENDING: '-'
};

const JSON_PATHS = {
    DATA,
    ID,
    TYPE,
    ATTRIBUTES,
    METADATA,
    METADATA_PAGE,
    METADATA_PAGE_OFFSET,
    METADATA_PAGE_LIMIT,
    METADATA_PAGE_TOTAL,
    LINKS,
    LINKS_SELF,
    FILTER,
    PAGE,
    PAGE_OFFSET,
    PAGE_LIMIT,
    SORT,
};

export {
    JSON_PATHS,
    SORT_QUALIFIER,
    DATA,
    ID,
    TYPE,
    ATTRIBUTES,
    METADATA,
    METADATA_PAGE,
    METADATA_PAGE_OFFSET,
    METADATA_PAGE_LIMIT,
    METADATA_PAGE_TOTAL,
    LINKS,
    LINKS_SELF,
    FILTER,
    PAGE,
    PAGE_OFFSET,
    PAGE_LIMIT,
    SORT,
};
