import { ActionUpdateRoles, ActionUpdateRolesReturn } from "@/_Actions/ActionUpdateRoles";
import FormSubmitButton from "@/components/Buttons/FormSubmitButton";
import Col from "@/components/Col";
import Dropdown from "@/components/Inputs/Dropdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import Row from "@/components/Row";
import { useActionState, useEffect, useMemo, useState } from "react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildRolesContent({ guildData, DBGuildData }: { guildData: any, DBGuildData: any }) {
    const initial = useMemo(() => ({
        success: false,
        message: undefined,
        accessRole: DBGuildData.accessRole ?? "",
        NSFWRole: DBGuildData.nsfwRole ?? "",
        managementRoles: DBGuildData.permittedToVerify ?? []
    }), [DBGuildData]);

    const [serverState, action] = useActionState(ActionUpdateRoles, initial);
    const [draft, setDraft] = useState<ActionUpdateRolesReturn>(initial);
    const [modified, setModified] = useState<boolean>(false);
    const [roles, setRoles] = useState<Array<any> | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [error, setError] = useState<string | null>(null);

    useEffect(() => setDraft(initial), [guildData, initial]);

    useEffect(() => {
        if (serverState.success) {
            setDraft(serverState);
            setModified(false);
        }
    }, [serverState]);

    useEffect(() => {
        (async () => {
            try {
                // Fetch guild's roles
                fetch(`/api/discord/guild/${guildData.id}/roles`)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setRoles(res.data.filter((role: any) => role.name !== "@everyone")); /* eslint-disable-line @typescript-eslint/no-explicit-any */
                    });
            } catch (error: any) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                setError(error.toString());
            }
        })();
    }, [guildData]);

    if (error) return <ErrorMessage title=":(" description={error} />;

    if (!roles || roles.length === 0) return (
        <Col classes="p-1.5 bg-teal-950 rounded-md gap-1.5">
            <LoadingSpinner />
        </Col>
    );

    return (
        <Col
            classes="
                p-1.5
                
                bg-gradient-to-br
                from-teal-950
                via-teal-800
                via-teal-700
                to-teal-800

                rounded-md
                gap-1.5
            "
        >

            <form id="change-guild-roles-settings-form" action={action} className="gap-2">

                <input type="hidden" name="guild-id" value={guildData.id} />

                <Col>
                    <p className="">Access Role:</p>
                    <Dropdown
                        name="accessRole"
                        value={draft.accessRole ?? ""}
                        onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            setDraft(prev => ({ ...prev, accessRole: e.target.value }));
                            setModified(true);
                        }}
                    >
                        {
                            (!DBGuildData.accessRole || DBGuildData.accessRole.trim() === "")
                            &&
                            <option disabled value="">Unset</option>
                        }
                        {
                            roles.map((role: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                                return <option key={i} value={role.id}>@{role.name}</option>
                            })
                        }
                    </Dropdown>
                </Col>

                <Col>
                    <p className="">NSFW Role:</p>
                    <Dropdown
                        name="NSFWRole"
                        value={draft.NSFWRole ?? ""}
                        onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            setDraft(prev => ({ ...prev, NSFWRole: e.target.value }));
                            setModified(true);
                        }}
                    >
                        {
                            (!DBGuildData.nsfwRole || DBGuildData.nsfwRole.trim() === "")
                            &&
                            <option disabled value="">Unset</option>
                        }
                        {
                            roles.map((role: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                                return <option key={i} value={role.id}>@{role.name}</option>
                            })
                        }
                    </Dropdown>
                </Col>

                <Col>
                    <p className="">Management Allowlist Roles:</p>
                    <Dropdown
                        multiple
                        name="managementRoles"
                        value={draft.managementRoles ?? []}
                        onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            const selected = Array.from(e.target.selectedOptions).map((opt: any) => opt.value); /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            setDraft(prev => ({ ...prev, managementRoles: selected }));
                            setModified(true);
                        }}
                    >
                        {
                            (!DBGuildData.permittedToVerify || DBGuildData.permittedToVerify.length === 0)
                            &&
                            <option disabled value="">Unset</option>
                        }
                        {
                            roles.map((role: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                                return <option key={i} value={role.id}>@{role.name}</option>
                            })
                        }
                    </Dropdown>
                </Col>

                {
                    modified &&
                    <Row classes="justify-end">
                        <FormSubmitButton text="Update Roles" />
                    </Row>
                }

            </form>

        </Col>
    );
}