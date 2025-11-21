package com.soa.user_service.dto;

import lombok.Data;
import java.util.Set;
import java.util.stream.Collectors;
import com.soa.user_service.entity.User;

@Data
public class UserProfileResponseDTO {
	private Long id;
	private String fullName;
	private String email;
	private String phoneNumber;
	private String bio;
	private Set<String> roles;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getBio() {
		return bio;
	}

	public void setBio(String bio) {
		this.bio = bio;
	}

	public Set<String> getRoles() {
		return roles;
	}

	public void setRoles(Set<String> roles) {
		this.roles = roles;
	}

	public static UserProfileResponseDTO fromUser(User user) {
		UserProfileResponseDTO dto = new UserProfileResponseDTO();
		dto.setId(user.getId());
		dto.setFullName(user.getFullName());
		dto.setEmail(user.getEmail());
		dto.setPhoneNumber(user.getPhoneNumber());
		dto.setBio(user.getBio());
		dto.setRoles(user.getRoles().stream()
				.map(role -> role.getName().name()) // Giả sử Role có getName() trả về ERole
				.collect(Collectors.toSet()));
		return dto;
	}
}
