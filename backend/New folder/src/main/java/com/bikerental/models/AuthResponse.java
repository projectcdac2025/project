package com.bikerental.models;

public class AuthResponse {
    private String token;
    private String userid;
    private String role;

    public AuthResponse() {}

    public AuthResponse(String token, String userid, String role) {
        this.token = token;
        this.userid = userid;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}

