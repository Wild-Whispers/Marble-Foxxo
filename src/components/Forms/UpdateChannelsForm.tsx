"use client";

import { ActionUpdateChannels } from "@/_Actions/ActionUpdateChannels";
import Col from "../Col";
import Row from "../Row";
import { useActionState, useEffect, useState } from "react";
import FormSubmitButton from "../Buttons/FormSubmitButton";
import ErrorMessage from "../Messages/ErrorMessage";
import Dropdown from "../Inputs/Dropdown";

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function UpdateChannelsForm({ guildID, guildData, channels }: { guildID: string, guildData: any, channels: Array<any> }) {
    const [formValues, action] = useActionState(ActionUpdateChannels, {
        success: false,
        message: undefined,
        memberJoinChannel: guildData?.memberJoinLogs ?? "",
        memberLeaveChannel: guildData?.memberLeaveLogs ?? "",
        modLogChannel: guildData?.moderationLogChannel ?? "",
        reportsChannel: guildData?.reportsChannel ?? ""
    });
    const [modified, setModified] = useState<boolean>(false);

    useEffect(() => {
        if (formValues.success) setModified(false);
    }, [formValues]);

    return (
        <form
            action={action}
            className="p-1.5 bg-teal-950 rounded-md gap-1.5"
        >
            {/*
            - set member join channel
            - set member leave channel
            - set moderation log channel
            - set reports channel
            */}

            <input type="hidden" name="guild-id" value={guildID} />

            <Col>
                <label htmlFor="memberJoinChannel">Member Join Logs Channel</label>
                <Dropdown
                    key={formValues.memberJoinChannel}
                    name="memberJoinChannel"
                    defaultValue={formValues.memberJoinChannel}
                    onChange={() => setModified(true)}
                >
                    {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        channels.map((channel: any, i: number) => {
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            <Col>
                <label htmlFor="memberLeaveChannel">Member Leave Logs Channel</label>
                <Dropdown
                    key={formValues.memberLeaveChannel}
                    name="memberLeaveChannel"
                    defaultValue={formValues.memberLeaveChannel}
                    onChange={() => setModified(true)}
                >
                    {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        channels.map((channel: any, i: number) => {
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            <Col>
                <label htmlFor="modLogChannel">Moderation Logs Channel</label>
                <Dropdown
                    key={formValues.modLogChannel}
                    name="modLogChannel"
                    defaultValue={formValues.modLogChannel}
                    onChange={() => setModified(true)}
                >
                    {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        channels.map((channel: any, i: number) => {
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            <Col>
                <label htmlFor="reportsChannel">Reports Channel</label>
                <Dropdown
                    key={formValues.reportsChannel}
                    name="reportsChannel"
                    defaultValue={formValues.reportsChannel}
                    onChange={() => setModified(true)}
                >
                    {
                        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                        channels.map((channel: any, i: number) => {
                            return <option key={i} value={channel.id}>#{channel.name}</option>
                        })
                    }
                </Dropdown>
            </Col>

            {
                !formValues.success && formValues.message &&
                <Col>
                    <ErrorMessage title=":(" description={formValues.message} />
                </Col>
            }

            {
                modified &&
                <Row classes="justify-end">
                    <FormSubmitButton text="Update Channels" />
                </Row>
            }
            
        </form>
    );
}