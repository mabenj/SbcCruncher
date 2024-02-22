import { Flex, Button } from '@chakra-ui/react';
import React from 'react'

export default function Pagination({
    page,
    lastPage,
    onPrev,
    onNext
}: {
    page: number;
    lastPage: number;
    onPrev: () => void;
    onNext: () => void;
}){
    return <Flex justifyContent="center" alignItems="center" gap={10}>
        <Button isDisabled={page === 1} colorScheme="gray" onClick={onPrev}>
            Prev
        </Button>
        <span>Page {page}</span>
        <Button
            isDisabled={page >= lastPage}
            colorScheme="gray"
            onClick={onNext}>
            Next
        </Button>
    </Flex>
}
