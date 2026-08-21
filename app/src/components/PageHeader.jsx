import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
export function PageHeader({ title, description, isBadge = false }) {
    return (
        <div className="mb-10 space-y-2">
            <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                    {title}
                </h1>
                {isBadge && description !== undefined && (
                    <Badge
                        variant="secondary"
                        className="px-3 py-0.5 text-xs font-semibold uppercase tracking-wider"
                    >
                        {description}
                    </Badge>
                )}
            </div>
            {!isBadge && description && (
                <p className="text-muted-foreground text-lg max-w-[750px]">
                    {description}
                </p>
            )}
        </div>
    );
}

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    isBadge: PropTypes.bool,
};