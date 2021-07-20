import { useCallback, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useAppContext } from '@magento/peregrine/lib/context/app';

import mergeOperations from '../../util/shallowMerge';

import DEFAULT_OPERATIONS from './breadcrumbs.gql';

// Just incase the data is unsorted, lets sort it.
const sortCrumbs = (a, b) => a.category_level > b.category_level;

// Generates the path for the category.
const getPath = (path, suffix) => {
    if (path) {
        return `/${path}${suffix}`;
    }

    // If there is no path this is just a dead link.
    return '#';
};

/**
 * Returns props necessary to render a Breadcrumbs component.
 *
 * @param {object} props
 * @param {object} props.query - the breadcrumb query
 * @param {string} props.categoryId - the id of the category for which to generate breadcrumbs
 * @return {{
 *   currentCategory: string,
 *   currentCategoryPath: string,
 *   isLoading: boolean,
 *   normalizedData: array,
 *   handleClick: function
 * }}
 */
export const useBreadcrumbs = props => {
    const { categoryId } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getBreadcrumbsQuery } = operations;
    const [
        ,
        {
            actions: { setNextRootComponent }
        }
    ] = useAppContext();

    const { data, loading, error } = useQuery(getBreadcrumbsQuery, {
        variables: { category_id: categoryId },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const categoryUrlSuffix = (data && data.category.url_suffix) || '';

    // When we have breadcrumb data sort and normalize it for easy rendering.
    const normalizedData = useMemo(() => {
        if (!loading && data) {
            const breadcrumbData = data.category.breadcrumbs;

            return (
                breadcrumbData &&
                breadcrumbData
                    .map(category => ({
                        category_level: category.category_level,
                        text: category.category_name,
                        path: getPath(
                            category.category_url_path,
                            categoryUrlSuffix
                        )
                    }))
                    .sort(sortCrumbs)
            );
        }
    }, [categoryUrlSuffix, data, loading]);

    const handleClick = useCallback(() => {
        // Sets next root component to show proper loading effect
        setNextRootComponent('category');
    }, [setNextRootComponent]);

    return {
        currentCategory: (data && data.category.name) || '',
        currentCategoryPath:
            (data && `${data.category.url_path}${categoryUrlSuffix}`) || '#',
        isLoading: loading,
        hasError: !!error,
        normalizedData: normalizedData || [],
        handleClick
    };
};
