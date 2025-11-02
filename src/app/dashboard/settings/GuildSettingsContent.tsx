import { ActionUpdateSettings } from "@/_Actions/ActionUpdateSettings";
import { LvlUpNotifactionDestinations } from "@/_Enums/LvlUpNotifactionDestinations";
import FormSubmitButton from "@/components/Buttons/FormSubmitButton";
import Col from "@/components/Col";
import Dropdown from "@/components/Inputs/Dropdown";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/Messages/ErrorMessage";
import Row from "@/components/Row";
import { useActionState, useEffect, useState } from "react";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function GuildSettingsContent({ guildData, DBGuildData }: { guildData: any, DBGuildData: any }) {
    const [formValues, action] = useActionState(ActionUpdateSettings, {
        success: false,
        message: undefined,
        lvlUpNotificationDestination: {
            setting: DBGuildData.lvlUpNotificationDestination?.setting as LvlUpNotifactionDestinations ?? LvlUpNotifactionDestinations.RELATIVE_CHANNEL,
            channel: DBGuildData.lvlUpNotificationDestination?.channelID ?? null
        }
    });
    const [modified, setModified] = useState<boolean>(false);
    const [roles, setRoles] = useState<Array<any> | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [channels, setChannels] = useState<Array<any> | null>(null); /* eslint-disable-line @typescript-eslint/no-explicit-any */
    const [error, setError] = useState<string | null>(null);
    const [lvlUpNotificationDestinationSetting, setLvlUpNotificationDestinationSetting] = useState<LvlUpNotifactionDestinations>(formValues.lvlUpNotificationDestination.setting);

    useEffect(() => {
        if (formValues.success) setModified(false);
    }, [formValues]);

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
        <Col classes="p-1.5 bg-teal-950 rounded-md gap-1.5">

            <form id="change-guild-roles-settings-form" action={action} className="gap-2">

                <input type="hidden" name="guild-id" value={guildData.id} />

                <Col>
                    <p className="">Level-Up Notifications Preferred Destination:</p>
                    <Dropdown
                        key={formValues.lvlUpNotificationDestination.setting}
                        name="lvlUpNotificationDestinationSetting"
                        defaultValue={formValues.lvlUpNotificationDestination.setting}
                        onChange={(e: any) => { /* eslint-disable-line @typescript-eslint/no-explicit-any */
                            setModified(true);
                            setLvlUpNotificationDestinationSetting(e.currentTarget.value);
                        }}
                    >
                        <option value={LvlUpNotifactionDestinations.RELATIVE_CHANNEL}>Sent in same channel as user message</option>
                        <option value={LvlUpNotifactionDestinations.DEFINED_CHANNEL}>Specific channel</option>
                        <option value={LvlUpNotifactionDestinations.USER_SPECIFIED}>Let the user specify</option>
                    </Dropdown>
                </Col>

                {
                    lvlUpNotificationDestinationSetting ===  LvlUpNotifactionDestinations.DEFINED_CHANNEL &&
                    <Col>
                        <p className="">Specify a channel where to send level-up notifications:</p>
                        <Dropdown
                            key={formValues.lvlUpNotificationDestination.channel}
                            name="lvlUpNotificationDestinationChannel"
                            defaultValue={formValues.lvlUpNotificationDestination.channel ?? ""}
                            onChange={() => setModified(true)}
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