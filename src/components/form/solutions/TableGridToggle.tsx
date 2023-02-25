import HoverTooltip from "@/components/ui/HoverTooltip";
import { ButtonGroup, IconButton, useColorModeValue } from "@chakra-ui/react";
import { mdiMenu, mdiViewGrid } from "@mdi/js";
import Icon from "@mdi/react";

export default function TableGridToggle({
    isTableView,
    onSetTableView,
    onSetGridView
}: {
    isTableView: boolean;
    onSetTableView: () => void;
    onSetGridView: () => void;
}) {
    const activeBg = useColorModeValue("gray.200", "gray.700");
    const nonActiveColor = useColorModeValue("gray.500", "gray.600");

    const activeProps = {
        backgroundColor: activeBg
    };

    const nonActiveProps = {
        color: nonActiveColor,
        variant: "ghost"
    };

    return (
        <ButtonGroup size="sm">
            <HoverTooltip label="Table view">
                <IconButton
                    {...(isTableView ? activeProps : nonActiveProps)}
                    icon={<Icon path={mdiMenu} size={1} />}
                    aria-label="Table view"
                    onClick={onSetTableView}
                />
            </HoverTooltip>
            <HoverTooltip label="Grid view">
                <IconButton
                    {...(!isTableView ? activeProps : nonActiveProps)}
                    icon={<Icon path={mdiViewGrid} size={1} />}
                    aria-label="Grid view"
                    onClick={onSetGridView}
                />
            </HoverTooltip>
        </ButtonGroup>
    );
}
