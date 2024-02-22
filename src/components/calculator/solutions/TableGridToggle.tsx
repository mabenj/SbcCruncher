import HoverTooltip from "@/components/ui/HoverTooltip";
import { ButtonGroup, IconButton } from "@chakra-ui/react";
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
    return (
        <ButtonGroup size="sm" isAttached>
            <HoverTooltip label="Table view">
                <IconButton
                    colorScheme={isTableView ? "brand" : "gray"}
                    icon={<Icon path={mdiMenu} size={1} />}
                    aria-label="Table view"
                    onClick={onSetTableView}
                />
            </HoverTooltip>
            <HoverTooltip label="Grid view">
                <IconButton
                    colorScheme={!isTableView ? "brand" : "gray"}
                    icon={<Icon path={mdiViewGrid} size={1} />}
                    aria-label="Grid view"
                    onClick={onSetGridView}
                />
            </HoverTooltip>
        </ButtonGroup>
    );
}
