import { ActionUpdateSettings, ActionUpdateSettingsReturn } from "@/_Actions/ActionUpdateSettings";
import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";
import FormSubmitButton from "@/components/Buttons/FormSubmitButton";
import Col from "@/components/Col";
import Dropdown from "@/components/Inputs/Dropdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import Row from "@/components/Row";
import { useActionState, useEffect, useMemo, useState } from "react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildSettingsContent({ guildData, DBGuildData }: { guildData: any, DBGuildData: any }) {
    const initial = useMemo(() => ({
        success: false,
        message: undefined,
        lvlUpNotificationDestination: {
            setting: DBGuildData.lvlUpNotificationDestination?.setting as LvlUpNotifactionDestinations ?? LvlUpNotifactionDestinations.RELATIVE_CHANNEL,
            channel: DBGuildData.lvlUpNotificationDestination?.channelID ?? null
        }
    }), [DBGuildData]);
    const [serverState, action] = useActionState(ActionUpdateSettings, initial);
    const [draft, setDraft] = useState<ActionUpdateSettingsReturn>(initial);
    const [modified, setModified] = useState<boolean>(false);
    const [roles, setRoles] = useState<Array<any> | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [channels, setChannels] = useState<Array<any> | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [error, setError] = useState<string | null>(null);
    const [lvlUpNotificationDestinationSetting, setLvlUpNotificationDestinationSetting] = useState<LvlUpNotifactionDestinations>(draft.lvlUpNotificationDestination.setting);

    useEffect(() => setDraft(initial), [initial]);

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

                // Fetch guild's channels
                fetch(`/api/discord/guild/${guildData.id}/channels`)
                    .then(res => res.json())
                    .then((res) => {
                        if (res.error) setError(res.error);
                        else setChannels(res.data.filter((channel: any) => channel.type === 0)); /* eslint-disable-line @typescript-eslint/no-explicit-any */
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
                    <p className="">Level-Up Notifications Preferred Destination:</p>
                    <Dropdown
                        name="lvlUpNotificationDestinationSetting"
                        value={draft.lvlUpNotificationDestination.setting}
                        onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            setDraft(prev => ({ ...prev, lvlUpNotificationDestination: { ...serverState.lvlUpNotificationDestination, setting: e.target.value } }));
                            setModified(true);
                            setLvlUpNotificationDestinationSetting(e.currentTarget.value);
                        }}
                    >
                        <option value={LvlUpNotifactionDestinations.RELATIVE_CHANNEL}>Sent in same channel as user message</option>
                        <option value={LvlUpNotifactionDestinations.DEFINED_CHANNEL}>Specific channel</option>
                        <option disabled value={LvlUpNotifactionDestinations.USER_SPECIFIED}>Let the user specify</option> {/* Temporarily disabled, still in development */}
                    </Dropdown>
                </Col>

                {
                    lvlUpNotificationDestinationSetting ===  LvlUpNotifactionDestinations.DEFINED_CHANNEL &&
                    <Col>
                        <p className="">Specify a channel where to send level-up notifications:</p>
                        <Dropdown
                            name="lvlUpNotificationDestinationChannel"
                            value={draft.lvlUpNotificationDestination.channel ?? ""}
                            onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                                setDraft(prev => ({ ...prev, lvlUpNotificationDestination: { ...serverState.lvlUpNotificationDestination, channel: e.target.value } }));
                                setModified(true);
                            }}
                        >
                            {
                                !channels ?
                                <option disabled value="">- This guild has no channels-</option> :
                                channels.map((channel: any, i: number) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                                    return <option key={i} value={channel.id}>#{channel.name}</option>
                                })
                            }
                        </Dropdown>
                    </Col>
                }

                {
                    modified &&
                    <Row classes="justify-end">
                        <FormSubmitButton text="Update Settings" />
                    </Row>
                }

            </form>

        </Col>
    );
}