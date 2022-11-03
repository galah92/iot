CREATE TABLE devices (
    device_id VARCHAR(64) NOT NULL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    state JSON,
    state_updated_at TIMESTAMPTZ,
    config JSON,
    config_updated_at TIMESTAMPTZ
);