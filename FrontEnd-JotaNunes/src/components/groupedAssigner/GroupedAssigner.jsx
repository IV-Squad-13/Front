import Collapsible from "@/components/collapsible/Collapsible";
import AssignmentTable from "@/components/assignmentTable/AssignmentTable";

const GroupedAssigner = ({ parentList }) => {
    return (
        <div>
            {parentList.map((parent) => {
                const children = parent.children ?? [];

                const detectedColumns =
                    children.length > 0 ? Object.keys(children[0]) : [];

                return (
                    <Collapsible key={parent.id} title={parent.name}>
                        <AssignmentTable
                            columns={detectedColumns}
                            data={children}
                        />
                    </Collapsible>
                );
            })}
        </div>
    );
};

export default GroupedAssigner;