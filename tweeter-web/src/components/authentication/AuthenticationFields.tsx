import React, { useCallback } from "react";

interface Props {
    onEnter: () => void;
    onPasswordChange: (value: string) => void;
    onAliasChange: (value: string) => void;
    isBottom: boolean;
}

const AuthenticationFields = ({ onEnter, onPasswordChange, onAliasChange, isBottom }: Props) => {

    const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            onEnter();
        }
    }, [onEnter]);

    return (
        <>
            <div className="form-floating">
                <input
                    type="text"
                    className="form-control"
                    size={50}
                    id="aliasInput"
                    aria-label="alias"
                    placeholder="name@example.com"
                    onKeyDown={handleKeyDown}
                    onChange={(event) => onAliasChange(event.target.value)}
                />
                <label htmlFor="aliasInput">Alias</label>
            </div>
            <div className="form-floating">
                <input
                    type="password"
                    className={`form-control ${isBottom ? 'bottom' : ''}`}
                    id="passwordInput"
                    aria-label="password"
                    placeholder="Password"
                    onKeyDown={handleKeyDown}
                    onChange={(event) => onPasswordChange(event.target.value)}
                />
                <label htmlFor="passwordInput">Password</label>
            </div>
        </>
    );
}

export default AuthenticationFields;