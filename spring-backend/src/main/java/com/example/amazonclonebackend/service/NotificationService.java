package com.example.amazonclonebackend.service;

import com.example.amazonclonebackend.dto.NotificationDTO;
import com.example.amazonclonebackend.entity.Notification;
import com.example.amazonclonebackend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification createNotification(String type, String payload) {
        Notification n = new Notification();
        n.setType(type);
        n.setPayload(payload);
        n.setIsRead(false);
        return notificationRepository.save(n);
    }

    public List<NotificationDTO> listAll() {
        return notificationRepository.findAll().stream().map(n -> new NotificationDTO(n.getId(), n.getType(), n.getPayload(), n.getIsRead(), n.getCreatedAt())).collect(Collectors.toList());
    }

    public List<NotificationDTO> listUnread() {
        return notificationRepository.findByIsReadFalse().stream().map(n -> new NotificationDTO(n.getId(), n.getType(), n.getPayload(), n.getIsRead(), n.getCreatedAt())).collect(Collectors.toList());
    }

}
